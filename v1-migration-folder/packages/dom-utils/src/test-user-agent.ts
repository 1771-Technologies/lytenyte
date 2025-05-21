/*
Copyright 2025 1771 Technologies

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
interface Brand {
  brand: string;
  version: string;
}

interface UserAgentData {
  brands: Brand[];
  platform: string;
}

declare global {
  interface Navigator {
    userAgentData?: UserAgentData;
  }
}

export function testUserAgent(re: RegExp) {
  if (typeof window === "undefined" || window.navigator == null) {
    return false;
  }
  return (
    window.navigator["userAgentData"]?.brands.some((brand) => re.test(brand.brand)) ||
    re.test(window.navigator.userAgent)
  );
}
