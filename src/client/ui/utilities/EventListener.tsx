import * as api from 'api';
import * as React from 'react';
import * as ui from 'client/ui';
import {core} from 'client/core';

export const EventListener = ui.createView<{onEventAsync: (event: api.models.Event) => Promise<void>}>(({onEventAsync}) => {
  React.useEffect(() => {
    core.event.addEventListener(onEventAsync);
    return () => core.event.removeEventListener(onEventAsync);
  });
});
