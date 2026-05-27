import * as React from 'react';
import { CellEditorOverrides } from '../types';

export const cellEditorOverrides: CellEditorOverrides = {
  ["Text"]: (props, col) => {
    return null
  }
}
