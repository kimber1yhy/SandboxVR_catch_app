import { forwardRef } from "react";
import styled from "styled-components";

interface CatcherProps {
  position: number;
}

const Catcher = forwardRef<HTMLDivElement, CatcherProps>(
  ({ position }, ref) => {
    return <CatcherWrapper ref={ref} left={position} />;
  }
);

interface CatcherWrapperProps {
  left: number;
}

const CatcherWrapper = styled.div<CatcherWrapperProps>`
  position: absolute;
  bottom: 0px;
  width: 100px;
  height: 10px;
  background-color: #ad8c6d;
  z-index: 2;
  border: 2px solid #fff;
  left: ${(p) => `${p.left}px`};
`;

export default Catcher;
