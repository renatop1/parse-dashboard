/*
 * Copyright (c) 2016-present, Parse, LLC
 * All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */
import DataBrowserHeader   from 'components/DataBrowserHeader/DataBrowserHeader.react';
import DragHandle          from 'components/DragHandle/DragHandle.react';
import HTML5Backend        from 'react-dnd-html5-backend';
import React               from 'react';
import styles              from 'components/DataBrowserHeaderBar/DataBrowserHeaderBar.scss';
import { DragDropContext } from 'react-dnd';

@DragDropContext(HTML5Backend)
export default class DataBrowserHeaderBar extends React.Component {
  render() {
    let { headers, onResize, selected, selectAll, onAddColumn, updateOrdering, readonly, handleDragDrop, minWidth } = this.props;
    let elements = [
      // Note: bulk checkbox is disabled as all rows are selected (not just visible ones due to current lazy loading implementation)
      // TODO: add bulk checking only visible rows
      <span key='check' className={styles.check}>
        {readonly ? null : <input className={styles.disabled} type='checkbox' disabled={true} checked={false} onChange={(e) => selectAll(e.target.checked)} />}
      </span>
    ];


    headers.forEach(({ width, name, type, targetClass, order }, i) => {
      let wrapStyle = { width };
      let onClick = null;
      if (type === 'String' || type === 'Number' || type === 'Date' || type === 'Boolean') {
        onClick = () => updateOrdering((order === 'descending' ? '' : '-') + name);
      }

      elements.push(
        <div
          onClick={onClick}
          key={'header' + i}
          className={styles.wrap}
          style={ wrapStyle }>
          <DataBrowserHeader
            name={name}
            type={type}
            targetClass={targetClass}
            order={order}
            index={i}
            moveDataBrowserHeader={handleDragDrop}/>
        </div>
      );
      elements.push(
        <DragHandle key={'handle' + i} className={styles.handle} onDrag={onResize.bind(null, i)} />
      );
    });

    elements.push(
      readonly ? null : (
        <div key='add' className={[styles.wrap, styles.addColumn].join(' ')}>
          <a
            href='javascript:;'
            role='button'
            className={styles.addColumnButton}
            onClick={onAddColumn}>
            Add a new column
          </a>
        </div>
      )
    );

    return <div className={styles.bar} style={{ minWidth: minWidth }}>{elements}</div>;
  }
}
