import { routes } from "../../../Router";
import AuthButtons from "../AuthButtons";
import NavLinks from "../NavLinks";

const DesktopNav: React.FC = () => {
  const navLinks = routes.filter((link) => link.showInNav);

  return (
    <div className="hidden md:flex w-full items-center justify-between">
      <div className="flex-1 flex justify-center space-x-6">
        <NavLinks
          navLinks={navLinks}
          style="flex space-x-6 text-sm font-medium hover:text-indigo-400 transition duration-300"
        />
      </div>
      <div className="flex items-center gap-2">
        <AuthButtons />
      </div>
    </div>
  );
};

export default DesktopNav;
