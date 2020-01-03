import React, { useState, useEffect } from 'react';
import { useConnectionState } from '~/hooks/useConnectionState';
import { useHistory } from 'react-router';
import { ConnectionStatus } from '~/components/Contexts/Connection/Connection';

import { Block } from '~/storybook/components/Block/Block';

export const ConnectionSelector: React.FC = () => {
  const history = useHistory();
  const connection = useConnectionState();
  const [method, setMethod] = useState<string>();

  useEffect(() => {
    if (connection.status === ConnectionStatus.CONNECTED && connection.method === method) {
      history.replace('/');
    }
  }, [connection.status, connection.method]);

  return (
    <>
      {connection.methods.map(method => {
        const Component = method.component;
        const active = method.name === connection.method;
        const select = () => {
          setMethod(method.name);
          connection.switch(method.name);
        };

        return (
          <Block key={method.name}>
            <Component active={active} select={select} />
          </Block>
        );
      })}
    </>
  );
};
