import { useEffect, useRef, useState } from "react";
import { routes } from "../../../Router";
import AuthButtons from "../AuthButtons";
import NavLinks from "../NavLinks";
import MobileMenu from "./MobileMenu";

const MobileNav: React.FC = () => {
  const navLinks = routes.filter((link) => link.showInNav);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const toggleMobileMenu = () => {
    setMobileMenuOpen((prev) => !prev);
  };
  const mobileMenuRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node)
      ) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    // Clean up the event listener when the component is unmounted
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  return (
    <div ref={mobileMenuRef}>
      <MobileMenu
        toggleMobileMenu={toggleMobileMenu}
        isMobileMenuOpen={isMobileMenuOpen}
      />
      {isMobileMenuOpen && (
        <div className="absolute top-16 left-0 p-2 w-full h-[35vh] bg-gray-800 z-50 shadow-lg md:hidden">
          <NavLinks
            navLinks={navLinks}
            onClick={() => setMobileMenuOpen(false)}
            style="flex flex-col items-start p-4 space-y-4 text-sm font-medium hover:text-indigo-400 transition duration-300"
          />
          <div className="flex gap-2 items-center">
            <AuthButtons />
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileNav;
