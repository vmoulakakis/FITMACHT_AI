import {test,expect} from "@playwright/test";

test("cinematic final landing follows the reference architecture and uses real evidence",async({page},info)=>{
 await page.goto("/");
 await expect(page.getByRole("heading",{name:/FITMATCH AI/}).first()).toBeVisible();
 await expect(page.locator(".fmCategoryCard")).toHaveCount(5);
 await expect(page.locator(".fmHowStep")).toHaveCount(5);
 await expect(page.locator(".fmPreviewProducts a")).toHaveCount(4);
 await expect(page.locator(".fmProductCard")).toHaveCount(5);
 await expect(page.getByText(/merchant με επαληθευμένη προμήθεια πάνω από 20€/)).toBeVisible();
 await expect(page.locator("a[href^='/api/out']")).toHaveCount(0);
 await info.attach("fitmatch-final-desktop",{body:await page.screenshot({fullPage:true}),contentType:"image/png"});
});
test("fitness category drives real product discovery",async({page})=>{
 await page.goto("/");
 await page.locator(".fmCategoryCard.cat-cardio").click();
 await expect(page.locator(".fmFilterPills button.selected")).toContainText("Cardio");
 await expect(page.locator(".fmProductCard").first()).toBeVisible();
 await page.locator(".fmFilterPills button").filter({hasText:"Ενδυνάμωση"}).click();
 await expect(page.locator(".fmProductCard").first()).toBeVisible();
 await expect(page.locator(".fmProductCard a[href^='/products/']").first()).toBeVisible();
});
test("unpopulated category explains the source gap and offers alternatives",async({page})=>{
 await page.goto("/");
 await page.locator(".fmCategoryCard.cat-recovery").click();
 await expect(page.locator(".fmNoResults")).toBeVisible();
 await page.getByRole("button",{name:"Εξερεύνησε όλες τις εναλλακτικές"}).click();
 await expect(page.locator(".fmProductCard").first()).toBeVisible();
});
test("each true SKU has unique landing with buyer checks and no fabricated affiliate link",async({page})=>{
 await page.goto("/");
 const first=page.locator(".fmProductCard a[href^='/products/']").first();
 const href=await first.getAttribute("href");
 expect(href).toMatch(/^\/products\/snapshot-/);
 await first.click();
 await expect(page).toHaveURL(new RegExp("/products/snapshot-"));
 await expect(page.locator(".fmDetailCopy h1")).toBeVisible();
 await expect(page.locator(".fmCheckGrid article")).toHaveCount(3);
 await expect(page.locator(".fmDetailHold")).toBeVisible();
 await expect(page.locator("a[href^='/api/out']")).toHaveCount(0);
 await expect(page.locator(".fmAltCard").first()).toBeVisible();
});
test("user search and budget remain interactive and data-grounded",async({page})=>{
 await page.goto("/");
 const search=page.getByRole("textbox",{name:"Τι fitness προϊόν αναζητάς;"});
 await search.fill("HMS");
 await page.locator(".fmHeroSearch button").click();
 await expect(page.locator(".fmProductCard").first()).toBeVisible();
 await expect(page.locator(".fmInlineSearch input")).toHaveValue("HMS");
 await page.locator("#fm-budget").fill("200");
 await expect(page.getByText(/Μέχρι 200/)).toBeVisible();
});
test("mobile navigation and product cards are usable",async({page},info)=>{
 test.skip(info.project.name!=="mobile-chromium","Mobile hamburger is intentionally hidden on desktop");
 await page.goto("/");
 await page.getByRole("button",{name:"Άνοιγμα μενού"}).click();
 await expect(page.locator(".fmNavLinks.open")).toBeVisible();
 await page.locator(".fmNavLinks a[href='#products']").click();
 await expect(page.locator(".fmNavLinks.open")).toHaveCount(0);
 await expect(page.locator(".fmProductCard").first()).toBeVisible();
 await info.attach("fitmatch-final-mobile",{body:await page.screenshot({fullPage:true}),contentType:"image/png"});
});
test("merchant redirect is not enabled for unapproved catalog rows",async({page})=>{
 const result=await page.request.get("/api/out?id=snapshot-1");
 expect(result.status()).toBe(404);
 const status=await (await page.request.get("/api/status")).json();
 expect(status.commissionPolicy).toContain(">20");
 expect(status.monetizedOffers).toBe(0);
});


test("minimal buyer funnel responds to goal, budget and space and outputs five real SKU cards",async({page},info)=>{
 await page.goto("/");
 await expect(page.locator(".fmQuizGoals button")).toHaveCount(4);
 await page.getByRole("button",{name:/Θέλω δύναμη/}).click();
 await expect(page.getByRole("heading",{name:/Ποιο είναι το budget/})).toBeVisible();
 await page.locator("#fitmatch-quiz-budget").fill("500");
 await page.getByRole("button",{name:/Μικρό διαμέρισμα/}).click();
 await page.getByRole("button",{name:/Δες τις 5 επιλογές μου/}).click();
 await expect(page.locator(".fmQuizMatchCard")).toHaveCount(5);
 await expect(page.locator(".fmQuizMatchCard a[href^='/products/']")).toHaveCount(5);
 await expect(page.locator(".fmQuizMatchCard a[href^='/api/out']")).toHaveCount(0);
 await info.attach("final-fitness-quiz",{body:await page.screenshot({fullPage:true}),contentType:"image/png"});
});
test("recovery produces explicit non-medical alternatives without fabricated purchase links",async({page})=>{
 await page.goto("/");
 await page.getByRole("button",{name:/Θέλω ήπια κίνηση/}).click();
 await page.getByRole("button",{name:/Δες τις 5 επιλογές μου/}).click();
 await expect(page.locator(".fmQuizMatchCard")).toHaveCount(5);
 await expect(page.locator(".fmQuizMatchInfo p").first()).toContainText("ιατρική αποκατάσταση");
 await expect(page.locator("a[href^='/api/out']")).toHaveCount(0);
});
