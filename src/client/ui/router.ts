import * as React from 'react';
import * as ReactLocation from '@tanstack/react-location';
import * as app from '.';

export const router = {
  all(path: string, children: Array<ReactLocation.Route>) {
    return {children, path};
  },

  one(path: string, factoryAsync: (params: app.RouteParams) => Promise<JSX.Element> | JSX.Element) {
    return {
      element: React.createElement(() => {
        const match = ReactLocation.useMatch();
        const element = match.data['element'] as JSX.Element;
        return element;
      }),
      loader: async (route: ReactLocation.RouteMatch) => {
        const params = new app.RouteParams(route.params);
        const element = await factoryAsync(params);
        return {element};
      },
      path
    };
  }
};
