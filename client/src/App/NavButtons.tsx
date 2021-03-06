import {Button, createStyles} from "@material-ui/core";
import {Link} from "react-router-dom";
import {FaHome, GiCardPlay, GiCardRandom} from "react-icons/all";
import {SiteRoutes} from "../Global/Routes/Routes";
import * as React from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {EnvDataStore} from "../Global/DataStore/EnvDataStore";
import {useDataStore} from "../Global/Utils/HookUtils";

const useStyles = makeStyles(theme => createStyles({
	appBarButton: {
		marginLeft: "0.5rem"
	},
}));

export const NavButtons = () =>
{
	const envData = useDataStore(EnvDataStore);

	return (
		<>
			<NavButton to={"/"} icon={<FaHome/>}>
				Home
			</NavButton>
			{envData.site.base && (
				<NavButton to={SiteRoutes.Games.resolve()} icon={<GiCardPlay/>}>
					Games
				</NavButton>
			)}
			<NavButton to={SiteRoutes.PacksBrowser.resolve()} icon={<GiCardRandom/>}>
				Card Packs
			</NavButton>
		</>
	)
};

const NavButton: React.FC<{ to: string; icon: React.ReactNode; }> = (props) =>
{
	const classes = useStyles();

	return (
		<Button size={"large"} className={classes.appBarButton} color="inherit" component={p => <Link {...p} to={props.to}/>} startIcon={props.icon}>
			{props.children}
		</Button>
	);
};