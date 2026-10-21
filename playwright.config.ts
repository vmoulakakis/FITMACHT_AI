import {defineConfig} from "@playwright/test";
export default defineConfig({
 testDir:"./e2e",
 fullyParallel:true,
 retries:0,
 workers:process.env.CI?2:undefined,
 reporter:[["list"],["html",{open:"never"}]],
 use:{baseURL:"http://127.0.0.1:3000",trace:"retain-on-failure",screenshot:"only-on-failure"},
 projects:[
  {name:"desktop-chromium",use:{browserName:"chromium",viewport:{width:1440,height:900}}},
  {name:"mobile-chromium",use:{browserName:"chromium",viewport:{width:390,height:844},deviceScaleFactor:1,isMobile:true,hasTouch:true}}
 ],
 webServer:{command:"npm run start -- -p 3000",url:"http://127.0.0.1:3000",reuseExistingServer:!process.env.CI,timeout:90000}
});
