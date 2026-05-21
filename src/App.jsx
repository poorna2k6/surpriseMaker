import { Component } from 'react';
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

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error) {
    return { error };
  }
  render() {
    if (this.state.error) {
      return (
        <div style={{ minHeight: '100dvh', background: '#0d0618', color: '#f3e8ff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1rem', padding: '2rem', textAlign: 'center', fontFamily: 'system-ui' }}>
          <div style={{ fontSize: '2rem' }}>💔</div>
          <h2 style={{ margin: 0, fontSize: '1.25rem', color: '#f472b6' }}>Something went wrong</h2>
          <pre style={{ background: '#1a0a2e', padding: '1rem', borderRadius: '0.75rem', fontSize: '0.75rem', color: '#c084fc', maxWidth: '600px', overflow: 'auto', textAlign: 'left', whiteSpace: 'pre-wrap' }}>
            {this.state.error.message}
          </pre>
          <button onClick={() => window.location.reload()} style={{ background: 'linear-gradient(135deg, #9333ea, #e879f9)', color: 'white', border: 'none', borderRadius: '9999px', padding: '0.75rem 1.5rem', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 600 }}>
            Reload App
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <div className="min-h-dvh bg-[#0d0618] text-purple-100">
          <Routes>
            {/* Landing has its own full-screen layout */}
            <Route path="/" element={<Landing />} />

            {/* All other routes share AppLayout (sidebar + mobile nav) */}
            <Route element={<AppLayout />}>
              <Route path="/create"   element={<CreateWizard />} />
              <Route path="/connect"  element={<ConnectPhotos />} />
              <Route path="/memories" element={<Memories />} />
              <Route path="/timeline" element={<Timeline />} />
              <Route path="/messages" element={<Messages />} />
              <Route path="/video"    element={<VideoBuilder />} />
              <Route path="/album"    element={<AlbumBuilder />} />
              <Route path="/preview"  element={<Preview />} />
              <Route path="/output"   element={<Output />} />
            </Route>
          </Routes>
        </div>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
