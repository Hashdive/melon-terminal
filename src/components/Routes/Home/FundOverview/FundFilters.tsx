import React from 'react';
import { CommonTableProps } from '~/components/Common/Table/Table';
import { useAsyncDebounce } from 'react-table';
import { InputField } from '~/components/Form/Input/Input';
import { SelectField } from '~/components/Form/Select/Select';
import { useEnvironment } from '~/hooks/useEnvironment';
import styled from 'styled-components';

const Wrapper = styled.div`
  // overflow: hidden; /* add this to contain floated children */
  padding-bottom: 50px;
`;

const SearchWrapper = styled.div`
  float: left;
  padding-right: 20px;
`;

const AssetSelectionWrapper = styled.div`
  float: right;
  min-width: 200px;
`;

export interface TableGlobalFilterProps<TData extends object = any> extends CommonTableProps<TData> {}

export function TableGlobalFilter<TData extends object>(props: TableGlobalFilterProps<TData>) {
  const environment = useEnvironment()!;

  const [value, setValue] = React.useState(props.table.state.globalFilter);

  const onSearchChange = useAsyncDebounce((searchValue) => {
    props.table.setGlobalFilter({ ...value, search: searchValue });
  }, 200);

  const tokens = environment.tokens
    .filter((token) => !token.historic)
    .map((token) => ({
      value: token.symbol,
      label: token.symbol,
      icon: token.symbol,
      description: token.name,
    }));

  return (
    <Wrapper>
      <SearchWrapper>
        <InputField
          name="search"
          value={value?.search || ''}
          onChange={(e) => {
            setValue({ ...value, search: e.target.value });
            onSearchChange(e.target.value);
          }}
          placeholder="Search..."
        />
      </SearchWrapper>
      <AssetSelectionWrapper>
        <SelectField
          name="assets"
          options={tokens}
          isMulti={true}
          onChange={(e) => {
            const assets = e?.map((item: any) => item.value);
            setValue({ ...value, assets });
            props.table.setGlobalFilter({ ...value, assets });
          }}
          placeholder="Select assets..."
        />
      </AssetSelectionWrapper>
    </Wrapper>
  );
}
