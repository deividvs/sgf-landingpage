function App() {
  console.log('App: Component rendering - SIMPLIFIED VERSION');
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full text-center">
        <h1 className="text-3xl font-bold text-green-700 mb-4">
          Sistema de Simulação Pecuária
        </h1>
        <p className="text-gray-600 mb-6">
          A aplicação está funcionando!
        </p>
        <div className="bg-green-100 text-green-800 py-3 px-4 rounded-lg font-semibold">
          ✓ React Carregado com Sucesso
        </div>
      </div>
    </div>
  );
}

export default App;
