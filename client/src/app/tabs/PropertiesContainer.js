/**
 * Copyright Camunda Services GmbH and/or licensed to Camunda Services GmbH
 * under one or more contributor license agreements. See the NOTICE file
 * distributed with this work for additional information regarding copyright
 * ownership.
 *
 * Camunda licenses this file to you under the MIT; you may not use this file
 * except in compliance with the MIT License.
 */

import React, { PureComponent } from 'react';

import classNames from 'classnames';

import dragger from '../../util/dom/dragger';

import css from './PropertiesContainer.less';

import {
  throttle
} from '../../util';

const DEFAULT_LAYOUT = {
  open: false,
  width: 250
};


/**
 * A generic container to hold our editors properties panels.
 *
 * Adds resize and toggle support.
 */
class PropertiesContainerWrapped extends PureComponent {

  constructor(props) {
    super(props);

    this.handleResize = throttle(this.handleResize);
  }

  changeLayout = (newLayout) => {

    const {
      onLayoutChanged
    } = this.props;

    if (typeof onLayoutChanged === 'function') {
      onLayoutChanged(newLayout);
    }
  }

  /**
   * Toggle properties panel expanded state.
   */
  handleToggle = () => {

    const {
      layout
    } = this.props;

    const {
      width,
      open
    } = layout && layout.propertiesPanel || DEFAULT_LAYOUT;

    this.changeLayout({
      propertiesPanel: {
        open: !open,
        width
      }
    });
  }

  handleResizeStart = event => {
    const onDragStart = dragger(this.handleResize);

    this.originalWidth = this.currentWidth;

    onDragStart(event);
  }

  handleResize = (_, delta) => {
    const {
      x
    } = delta;

    if (x === 0) {
      return;
    }

    const newWidth = this.originalWidth - x;

    const open = newWidth > 25;

    const width = (open ? newWidth : DEFAULT_LAYOUT.width);

    this.changeLayout({
      propertiesPanel: {
        open,
        width
      }
    });
  }

  render() {

    const {
      layout,
      forwardedRef,
      className
    } = this.props;

    const propertiesPanel = layout.propertiesPanel || DEFAULT_LAYOUT;

    const open = propertiesPanel.open || propertiesPanel.width === 0;
    const width = open ? propertiesPanel.width : 0;

    const propertiesStyle = {
      width
    };

    this.currentWidth = width;

    return (
      <div
        className={ classNames(
          css.PropertiesContainer,
          className,
          { open }
        ) }
        style={ propertiesStyle }>
        <div
          className="toggle"
          onClick={ this.handleToggle }
          draggable
          onDragStart={ this.handleResizeStart }
        >Properties Panel</div>
        {
          open &&
            <div
              className="resize-handle"
              draggable
              onDragStart={ this.handleResizeStart }
            ></div>
        }
        <div className="properties-container" ref={ forwardedRef }></div>
      </div>
    );
  }

}

export default React.forwardRef(
  function PropertiesContainer(props, ref) {
    return <PropertiesContainerWrapped { ...props } forwardedRef={ ref } />;
  }
);