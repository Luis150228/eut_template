import './App.css';
import CardNav from './components/aceternity/CardNav';
import { SidebarEUT } from './components/aceternity/SidebarEUT';
import { GradientText } from './components/animate-ui/text/gradient';
// import ThemeToggle from './components/ThemeToggle';
import logo from '../public/LogoEUT.svg';

function App() {
	return (
		<>
			{/* CardNav AQUI */}
			<CardNav
				logo={logo}
				logoAlt='Company Logo'
				items={[
					{ label: 'About', bgColor: '#0D0716', textColor: '#fff', links: [{ label: 'Company' }] },
					{ label: 'Projects', bgColor: '#170D27', textColor: '#fff', links: [{ label: 'Featured' }] },
					{ label: 'Contact', bgColor: '#271E37', textColor: '#fff', links: [{ label: 'Email' }] },
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
