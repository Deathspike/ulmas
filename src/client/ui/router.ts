import * as React from 'react';
import * as ReactLocation from '@tanstack/react-location';
import {core} from 'client/core';

export const router = {
  all(path: string, children: Array<ReactLocation.Route>) {
    return {children, path};
  },

  one(path: string, createAsync: () => Promise<JSX.Element> | JSX.Element) {
    return {
      element: React.createElement(() => {
        const match = ReactLocation.useMatch();
        const element = match.data['element'] as JSX.Element;
        return element;
      }),
      loader: async (route: ReactLocation.RouteMatch) => {
        core.route.set(route.params);
        const element = await createAsync();
        return {element};
      },
      path
    };
  }
};
