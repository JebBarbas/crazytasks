import React, {Suspense} from 'react';
import ReactDOM from 'react-dom';
import App from './App';

import {AuthProvider} from './contexts/AuthContext'

ReactDOM.render(
    <React.StrictMode>
        <AuthProvider placeholder="Cargando...">
            <Suspense fallback={'Conectando a la app...'}>
                <App/>
            </Suspense>
        </AuthProvider>
    </React.StrictMode>,
    document.getElementById('root')
);
