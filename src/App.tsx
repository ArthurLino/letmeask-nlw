import { Home } from "./pages/Home";
import { NewRoom } from "./pages/NewRoom";
import { Room } from "./pages/Room";
import { AdminRoom } from "./pages/AdminRoom";

import { BrowserRouter, Route, Switch } from 'react-router-dom'

import './styles/auth.scss'

import { AuthContextProvider } from "./contexts/AuthContext";

function App() {

  return (
    <BrowserRouter>

      <AuthContextProvider>

        <Switch>

          <Route path="/" exact component={Home} />
          <Route path="/rooms/new" component={NewRoom} />
          <Route path="/rooms/:id" component={Room} />
          <Route path="/admin/rooms/:id" component={AdminRoom} />

        </Switch>

      </AuthContextProvider>

    </BrowserRouter>
  );
}

export default App;
