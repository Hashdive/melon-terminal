import React, { useEffect, useState } from 'react';
import BigNumber from 'bignumber.js';
import * as Rx from 'rxjs';
import { ExchangeDefinition, Trading, ZeroExV2TradingAdapter, TokenDefinition } from '@melonproject/melonjs';
import { useEnvironment } from '~/hooks/useEnvironment';
import { useAccount } from '~/hooks/useAccount';
import { useTransaction } from '~/hooks/useTransaction';
import { TransactionModal } from '~/components/Common/TransactionModal/TransactionModal';
import { Button } from '~/storybook/components/Button/Button';
import { catchError, switchMap } from 'rxjs/operators';
import { SignedOrder, assetDataUtils } from '@0x/order-utils-v2';
import { Subtitle } from '~/storybook/components/Title/Title';
import { FormattedDate } from '~/components/Common/FormattedDate/FormattedDate';
import { NotificationBar, NotificationContent } from '~/storybook/components/NotificationBar/NotificationBar';
import { FormattedNumber } from '~/components/Common/FormattedNumber/FormattedNumber';
import { TokenValue } from '~/components/Common/TokenValue/TokenValue';
import { toTokenBaseUnit } from '~/utils/toTokenBaseUnit';

export interface FundRequestForQuoteOfferProps {
  active: boolean;
  trading: string;
  exchange: ExchangeDefinition;
  market?: string;
  amount?: BigNumber;
  symbol?: string;
  side?: 'buy' | 'sell';
}

export const FundRequestForQuoteOffer: React.FC<FundRequestForQuoteOfferProps> = props => {
  const [quote, setQuote] = useState<{
    offer: SignedOrder;
    taker: TokenDefinition;
    maker: TokenDefinition;
    price: BigNumber;
    amount: BigNumber;
  }>();

  const [state, setState] = useState(() => ({
    price: new BigNumber(0),
    loading: false,
  }));

  const environment = useEnvironment()!;
  const account = useAccount()!;

  const loading = state.loading;
  const active = !!(props.market && props.side && props.amount && !props.amount.isNaN() && !props.amount.isZero());
  const ready = active && !state.loading && !state.price.isZero() && !state.price.isNaN();

  const transaction = useTransaction(environment);

  useEffect(() => {
    setState(() => ({
      price: new BigNumber(0),
      loading: true,
    }));

    // Refetch every 10 seconds.
    const observable$ = Rx.timer(500).pipe(
      switchMap(async () => {
        const key = props.side === 'sell' ? 'value' : 'amount';
        const body = {
          [key]: props.amount!.toString(),
          market: props.market!,
          side: props.side!,
          model: 'indicative',
          profile: 'melon',
          meta: { taker: props.trading },
        };

        const query = await fetch(`${process.env.MELON_API_GATEWAY}/rfq/quotes`, {
          body: JSON.stringify(body),
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const result = await query.json();

        return props.side === 'sell'
          ? new BigNumber(1).dividedBy(result.price ?? 'NaN')
          : new BigNumber(result.price ?? 'NaN');
      }),
      catchError(() => Rx.of(new BigNumber(0)))
    );

    const empty$ = Rx.of(new BigNumber(0));
    const subscription = (active ? observable$ : empty$).subscribe(price => {
      setState(() => ({
        price,
        loading: false,
      }));
    });

    return () => subscription.unsubscribe();
  }, [props.market, props.side, props.amount?.valueOf()]);

  const submit = async () => {
    const key = props.side === 'sell' ? 'value' : 'amount';
    const body = {
      [key]: props.amount!.toString(),
      market: props.market!,
      side: props.side!,
      model: 'firm',
      profile: 'melon',
      meta: { taker: props.trading },
    };

    try {
      const query = await fetch(`${process.env.MELON_API_GATEWAY}/rfq/quotes`, {
        body: JSON.stringify(body),
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await query.json();

      if (result?.data && result.data['0xv2order']) {
        const offer = result.data['0xv2order'] as SignedOrder;
        const taker = assetDataUtils.decodeERC20AssetData(offer.takerAssetData).tokenAddress;
        const maker = assetDataUtils.decodeERC20AssetData(offer.makerAssetData).tokenAddress;

        setQuote({
          price: new BigNumber(result?.price ?? 'NaN'),
          amount: new BigNumber(result?.amount ?? 'NaN'),
          taker: environment.getToken(taker)!,
          maker: environment.getToken(maker)!,
          offer: {
            ...offer,
            expirationTimeSeconds: new BigNumber(offer.expirationTimeSeconds),
            takerAssetAmount: new BigNumber(offer.takerAssetAmount),
            takerFee: new BigNumber(offer.takerFee),
            makerAssetAmount: new BigNumber(offer.makerAssetAmount),
            makerFee: new BigNumber(offer.makerFee),
            salt: new BigNumber(offer.salt),
          },
        });
      }
    } catch (e) {
      // TODO: Handle errors.
    }
  };

  const quantity = quote && toTokenBaseUnit(props.amount, quote.taker.decimals);

  useEffect(() => {
    if (!quote) {
      return;
    }

    (async () => {
      const trading = new Trading(environment, props.trading);
      const adapter = await ZeroExV2TradingAdapter.create(environment, props.exchange.exchange, trading);
      const tx = adapter.takeOrder(account.address!, quote.offer, quantity);

      transaction.start(tx, 'Take order');
    })();
  }, [quote]);

  const symbols = props.market?.split('-', 2) ?? [];
  const maker = props.side === 'sell' ? symbols[1] : symbols[0];
  const taker = props.side === 'sell' ? symbols[0] : symbols[1];
  const rate =
    props.side === 'sell' ? new BigNumber(1).dividedBy(quote?.price ?? 'NaN') : new BigNumber(quote?.price ?? 'NaN');

  return (
    <>
      <Subtitle>
        {props.market && ready ? `Rate: (1 ${maker} = ${state.price.toFixed(4)} ${taker})` : `No Rate`}
      </Subtitle>
      <Button type="button" disabled={!(ready && props.active)} loading={loading} onClick={submit}>
        {loading
          ? ''
          : ready
          ? `Buy ${state.price.multipliedBy(props.amount!).toFixed(4)} ${props.symbol}`
          : 'No Offer'}
      </Button>

      <TransactionModal transaction={transaction}>
        <NotificationBar kind="neutral">
          <NotificationContent>
            You are selling{' '}
            <TokenValue value={quantity} decimals={quote?.taker.decimals} symbol={quote?.taker.symbol} /> in exchange for{' '}
            <TokenValue
              value={quote?.offer.makerAssetAmount}
              decimals={quote?.maker.decimals}
              symbol={quote?.maker.symbol}
            />
            .<br />
            (Rate: <TokenValue value={1} digits={0} decimals={0} symbol={maker} /> ={' '}
            <TokenValue value={rate} decimals={0} symbol={taker} />)
            <br />
            <br />
            This quote is valid until <FormattedDate timestamp={quote?.offer?.expirationTimeSeconds} />.
          </NotificationContent>
        </NotificationBar>
      </TransactionModal>
    </>
  );
};
