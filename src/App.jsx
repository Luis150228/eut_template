import './App.css';
import CardNav from './components/aceternity/CardNav';
import { SidebarEUT } from './components/aceternity/SidebarEUT';
import { GradientText } from './components/animate-ui/text/gradient';
// import ThemeToggle from './components/ThemeToggle';

function App() {
	return (
		<>
			{/* CardNav AQUI */}
			<CardNav
				logoAlt='Company Logo'
				items={[
					{
						label: 'Reportes',
						cards: 'reporte',
						bgColor: '#0D0716',
						textColor: '#fff',
						links: [{ label: 'Reportes' }],
					},
					{
						label: 'Formularios',
						cards: 'formulario',
						bgColor: '#170D27',
						textColor: '#fff',
						links: [{ label: 'Formularios' }],
					},
					{
						label: 'Data update',
						cards: 'dataupdate',
						bgColor: '#271E37',
						textColor: '#fff',
						links: [{ label: 'Actualizar Datos' }],
					},
				]}
				baseColor='var(--cn-base)'
				menuColor='var(--sidebar-fg)'
				buttonBgColor='var(--cn-button-bg)'
				buttonTextColor='var(--cn-button-fg)'
			/>
			<SidebarEUT />
			{/* <ThemeToggle className='fixed bottom-4 right-4 z-50' /> */}
		</>
	);
}

export default App;
