import { BrowserRouter, Routes, Route } from 'react-router-dom';

import AppLayout from './components/layout/AppLayout';

import Landing       from './pages/Landing';
import CreateWizard  from './pages/CreateWizard';
import ConnectPhotos from './pages/ConnectPhotos';
import Memories      from './pages/Memories';
import Timeline      from './pages/Timeline';
import Messages      from './pages/Messages';
import VideoBuilder  from './pages/VideoBuilder';
import AlbumBuilder  from './pages/AlbumBuilder';
import Preview       from './pages/Preview';
import Output        from './pages/Output';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-dvh bg-[#0d0618] text-purple-100">
        <Routes>
          {/* Landing has its own full-screen layout */}
          <Route path="/" element={<Landing />} />

          {/* All other routes share AppLayout (sidebar + mobile nav) */}
          <Route element={<AppLayout />}>
            <Route path="/create"  element={<CreateWizard />} />
            <Route path="/connect" element={<ConnectPhotos />} />
            <Route path="/memories" element={<Memories />} />
            <Route path="/timeline" element={<Timeline />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/video"   element={<VideoBuilder />} />
            <Route path="/album"   element={<AlbumBuilder />} />
            <Route path="/preview" element={<Preview />} />
            <Route path="/output"  element={<Output />} />
          </Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
