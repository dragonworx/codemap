import {
   React,
   useState,
   useRef,
   makeStyles,
   MouseEvent,
   KeyboardEvent,
   WheelEvent,
} from '~lib';
import {
   Keys
} from '~hooks';
import { Tuple } from '~core/geom';
import { Drag } from '~core/drag';

export const MAX_ZOOM = 200;
export const MIN_ZOOM = 20;
export const DEFAULT_ZOOM = 100;

export interface AffineViewProps {
   children: React.ReactNode | React.ReactNode[];
   zoom?: number;
   pan?: Tuple;
   onPan?: (panX: number, panY: number) => void;
   onZoom?: (zoom: number) => void;
}

const useStyles = (panX: number, panY: number, zoom: number) => {
   const scale = zoom / 100;
   return makeStyles(theme => ({
      affineTransform: {
         position: 'absolute',
         top: 0,
         left: 0,
         width: '100%',
         height: '100%',
         '& > *': {
            transform: `translate(${panX}px, ${panY}px) scale(${scale}, ${scale})`,
         }
      },
      debug: {
         position: 'absolute',
         top: 0,
         right: 5,
         fontSize: 'smaller',
         transform: 'none!important'
      },
      panHover: {
         cursor: 'grab',
      },
      panDrag: {
         cursor: 'grabbing',
      },
   }));
};

export function AffineView(props: AffineViewProps) {
   const divElement: React.Ref<HTMLDivElement> = useRef(null);
   const { zoom: defaultZoom = DEFAULT_ZOOM, pan: defaultPan = { x: 0, y: 0 }, children, onPan, onZoom } = props;
   const [ zoom, setZoom ] = useState(defaultZoom);
   const [ panX, setPanX ] = useState(defaultPan.x);
   const [ panY, setPanY ] = useState(defaultPan.y);
   const [ isMouseDown, setIsMouseDown ] = useState(false);
   const [ isPanHover, setIsPanHover ] = useState(false);
   const [ drag ] = useState(new Drag());
   const classes = useStyles(panX, panY, zoom)();

   const canvasRect = () => divElement.current!.getBoundingClientRect();
   const mouseToLocalPoint = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const rect = canvasRect();
      const x = (clientX - rect.left);
      const y = (clientY - rect.top);
      return { x, y } as Tuple;
   };

   const onMouseDown = (e: MouseEvent) => {
      setIsMouseDown(true);
      const point = mouseToLocalPoint(e);
      drag.start(point, { x: panX, y: panY });
   }

   const onMouseMove = (e: MouseEvent) => {
      if (isMouseDown && isPanHover) {
         const point = mouseToLocalPoint(e);
         const { x: newPanX, y: newPanY } = drag.value(point);
         setPanX(newPanX);
         setPanY(newPanY);
         onPan && onPan(newPanX, newPanY);
      }
   };

   const onMouseUp = () => setIsMouseDown(false);

   const onKeyDown = (e: KeyboardEvent) => {
      if (e.keyCode === Keys.SPACE) {
         setIsPanHover(true);
      }
   };

   const onKeyUp = (e: KeyboardEvent) => {
      if (e.keyCode === Keys.SPACE) {
         setIsPanHover(false);
      }
   };

   const onWheel = (e: WheelEvent<HTMLDivElement>) => {
      const { deltaY } = e;
      const delta = deltaY > 0 ? 10 : -10;
      const newZoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, zoom - delta));
      setZoom(newZoom);
      onZoom && onZoom(newZoom);
   };

   return (
      <div
         ref={divElement}
         tabIndex={0}
         className={`${classes.affineTransform} ${isPanHover ? isMouseDown ? classes.panDrag : classes.panHover : ''}`}
         onMouseDown={onMouseDown}
         onMouseMove={onMouseMove}
         onMouseUp={onMouseUp}
         onKeyDown={onKeyDown}
         onKeyUp={onKeyUp}
         onWheel={onWheel}
      >
         {children}
         <div className={classes.debug}>zoom: {zoom} pan: {panX}, {panY}</div>
      </div>
   );
}