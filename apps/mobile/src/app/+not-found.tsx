import React from "react";
import { Redirect } from "expo-router";

/** Any unknown address bounces to the front door — never a dead end. */
export default function NotFound(): React.JSX.Element {
  return <Redirect href="/" />;
}
