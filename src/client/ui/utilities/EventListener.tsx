import * as api from 'api';
import * as React from 'react';
import * as ui from 'client/ui';
import {core} from 'client/core';

export const EventListener = ui.createView<{onEvent: (event: api.models.Event) => void}>(({onEvent}) => {
  React.useEffect(() => {
    core.event.addEventListener(onEvent);
    return () => core.event.removeEventListener(onEvent);
  });
});
