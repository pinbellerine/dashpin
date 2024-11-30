import type { Component } from 'solid-js';
import { Link, useRoutes, useLocation } from '@solidjs/router';

import { routes } from './routes';

const App: Component = () => {
  const location = useLocation();
  const Route = useRoutes(routes);

  return (
    <>
      <nav class="bg-gray-200 text-gray-900 px-4">
        <ul class="flex items-center">
          <li class="py-2 px-4">
            <Link href="/" class="no-underline hover:underline">
              Home
            </Link>
          </li>
          <li class="py-2 px-4">
            <Link href="/about" class="no-underline hover:underline">
              About
            </Link>
          </li>

          <li class="py-2 px-4">
            <Link href="/Login" class="no-underline hover:underline">
              Login
            </Link>
          </li>

          <li class="py-2 px-4">
            <Link href="/Register" class="no-underline hover:underline">
              Register
            </Link>
          </li>

          <li class="py-2 px-4">
            <Link href="/Dashboard" class="no-underline hover:underline">
              Dashboard
            </Link>
          </li>

          <li class="py-2 px-4">
            <Link href="/AgGrid" class="no-underline hover:underline">
              Data
            </Link>
          </li>

          <li class="text-sm flex items-center space-x-1 ml-auto">
            <span>URL:</span>
            <input
              class="w-75px p-1 bg-white text-sm rounded-lg"
              type="text"
              readOnly
              value={location.pathname}
            />
          </li>
        </ul>
      </nav>

      <main>
        <Route />
      </main>
    </>
  );
};

export default App;
