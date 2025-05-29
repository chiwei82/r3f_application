import { Perf } from 'r3f-perf';

export default function PerfMonitor({ show, position }) {
  if (!show) return null;
  return <Perf position={position} />;
}
