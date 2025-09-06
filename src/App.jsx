import './App.css';
import { SidebarDemo } from './components/aceternity/SidebarDemo';
import { GradientText } from './components/animate-ui/text/gradient';
import ThemeToggle from './components/ThemeToggle';

function App() {
	return (
		<>
			{/* <div className='enter'>Ahora sí entra con punch 🚀</div> */}
			<GradientText
				text='EUT Sistema de Reportes'
				className='text-3xl md:text-2xl font-extrabold tracking-tight leading-tight'
			/>
			<SidebarDemo />
			<ThemeToggle className='fixed bottom-4 right-4 z-50' />
		</>
	);
}

export default App;
