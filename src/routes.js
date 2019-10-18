import Login from './pages/Login';
import Registration from './pages/Registration';
import ForgotPassword from './pages/Login/forgotPassword';
import MenuList from './pages/TifinMenu/MenuList';
import Request from './pages/Request';
import OrderExtraTifin from './pages/Order';
import ChangeNominee from './pages/Profile/ChangeNominee';
import ChangeProfile from './pages/Profile/ChangeProfile';
import CancelTifin from './pages/CancelTIfin';
import BillingHistory from './pages/Billing';
import Plan from './pages/Plan';
import Auth from './pages/Auth';
import Payment from './pages/Payment';
import Delivery from './pages/Delivery';
import MapView from './pages/Delivery/MapView';

export default {
	Auth: { screen: Auth },
	Login: { screen: Login},
	Registration: { screen: Registration },
	ForgotPassword: { screen: ForgotPassword },
	MenuList: { screen: MenuList },
	OrderExtraTifin: { screen: OrderExtraTifin },
	ChangeNominee: { screen: ChangeNominee },
	ChangeProfile: { screen: ChangeProfile },
	BillingCycle: { screen: BillingHistory },
	CancelTifin: { screen: CancelTifin },
	Plan: { screen: Plan },
	Settings: { screen: Request },
	Payment: {screen: Payment},
	Delivery: {screen: Delivery},
	MapView: {screen: MapView}
};
