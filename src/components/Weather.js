import React, { Fragment, useState, useCallback } from 'react';
import classnames from 'classnames';
import { Button, Dialog, Classes } from '@blueprintjs/core';
import './Weather.scss';

export default React.memo(function Location() {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = useCallback(() => setIsOpen(true), []);
  const handleClose = useCallback(() => setIsOpen(false), []);

  return (
    <Fragment>
      <Button icon="cloud" onClick={handleOpen} large></Button>

      <Dialog
        icon="cloud"
        title="Seeing"
        isOpen={isOpen}
        onClose={handleClose}
        canOutsideClickClose
        className="Weather"
      >
        <div className={classnames(Classes.DIALOG_BODY, 'iframe-container')}>
          <iframe
            src="https://www.meteoblue.com/en/weather/widget/seeing?geoloc=detect&noground=0"
            frameBorder="0"
            scrolling="NO"
            sandbox="allow-same-origin allow-scripts allow-popups allow-popups-to-escape-sandbox"
            style={{ width: '100%', height: '698px' }}
          />
        </div>
      </Dialog>
    </Fragment>
  );
});
