import React from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
} from "@nextui-org/react";

export default function CustomNavbar() {
  return (
    <Navbar shouldHideOnScroll>
      <NavbarBrand>
        <p className="font-bold text-inherit">Alij Visual AI</p>
      </NavbarBrand>
      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem>
          <Link color="foreground" href="#">
            How It Works
          </Link>
        </NavbarItem>
        <NavbarItem isActive>
          <Link href="#" aria-current="page">
            Linear Regression
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" href="#">
            Back Propagation
          </Link>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}
