import * as React from 'react';
import * as ui from 'client/ui';
import {core} from 'client/core';

export const InputView = ui.createView(() => /^true$/i.test(core.input.keyboardMode.value) && (
  <ui.material.Backdrop sx={styles.disabler} invisible open />
));

const styles = {
  disabler: {
    cursor: 'none'
  }
};
