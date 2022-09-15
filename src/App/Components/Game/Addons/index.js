import React, { useEffect, useState, useRef } from 'react';
import {Popover, OverlayTrigger, Overlay, Tooltip} from "react-bootstrap";
import {__, forceSatoshiFormat} from "../../../../Helper";
import stroage from "../../../../Storage";
  
function CreditRange(props) {
  const [show, setShow] = useState(false);
  const [target, setTarget] = useState(null);
  const ref = useRef(null);
  const credit = stroage.getKey('credit');

  const handleClick = (event) => {
    event.preventDefault()
    setShow(!show);
    setTarget(event.target);
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
          setShow(false);
        }
    }
    document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);

  const style = {
      borderColor: "transparent",
      borderWidth: "1px",
      borderStyle: "solid",
      borderRadius: '2px'
  }

  return (
    <div ref={ref}>
      <button onClick={handleClick} className={'btn bg-cs btn-lg shadow-none h-100'}><i className="mdi mdi-unfold-more-vertical"/></button>
      <Overlay
        show={show}
        target={target}
        placement="top"  
        container={ref.current}
        containerPadding={20}
        rootClose={true}
      >
        <Popover id="popover-contained">
          <Popover.Content className="p-0">
            <div class="input-group" style={style}>
              <span class="input-group-prepend">
                <button type="button" class="btn btn-cs btn-xs shadow-none rounded-0" onClick={ e => props.min(e) }>MIN</button>
              </span>
              <span class="input-group-prepend">
                <button type="button" class="btn btn-cs btn-xs shadow-none rounded-0" onClick={ e => props.multi(e) }>X2</button>
              </span>
              <span class="input-group-prepend">
                <button type="button" class="btn btn-cs btn-xs shadow-none rounded-0" onClick={ e => props.devide(e) }>/2</button>
              </span>
              <span class="input-group-append">
                <button type="button" class="btn btn-cs btn-xs shadow-none rounded-0" onClick={ e => props.max(e) }>MAX</button>
              </span>
            </div>
          </Popover.Content>
        </Popover>
      </Overlay>
    </div>
  );
}

export default CreditRange;