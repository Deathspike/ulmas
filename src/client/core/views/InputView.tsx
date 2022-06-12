import * as React from 'react';
import * as ui from 'client/ui';
import {core} from 'client/core';

export const InputView = ui.createView(() => core.input.keyboardMode && (
  <ui.material.Backdrop sx={styles.disabler} invisible open />
));

const styles = {
  disabler: {
    cursor: 'none'
  }
};
