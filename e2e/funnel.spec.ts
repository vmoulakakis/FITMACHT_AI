import {test,expect} from "@playwright/test";
test("cinematic pain-led landing, two-input advisor and evidence-only commerce",async({page},info)=>{
 await page.goto("/");
 await expect(page.getByRole("heading",{name:/Δεν έχεις χώρο/})).toBeVisible();
 await expect(page.getByRole("heading",{name:/Ποιο είναι το/})).toBeVisible();
 await info.attach("cinematic-landing",{body:await page.screenshot({fullPage:true}),contentType:"image/png"});
 await page.getByRole("button",{name:/Λύσε το πρόβλημα: Δεν έχω χώρο/}).click();
 await expect(page.getByLabel(/ΠΕΣ ΤΟ ΠΡΟΒΛΗΜΑ/)).toBeVisible();
 await page.getByRole("button",{name:/Βρες τι πραγματικά μου ταιριάζει/}).click();
 await expect(page.getByRole("heading",{name:/Από το πρόβλημα/})).toBeVisible();
 await expect(page.locator(".solutionChoice")).toHaveCount(3);
 await expect(page.getByText(/Δεν έχουμε ακόμη επαληθευμένο προϊόν/)).toBeVisible();
 await info.attach("cinematic-results",{body:await page.screenshot({fullPage:true}),contentType:"image/png"});
});
test("zero budget yields solution without fake affiliate offer",async({page})=>{
 await page.goto("/");
 await page.getByRole("button",{name:/Λύσε το πρόβλημα: Δεν θέλω να πετάξω/}).click();
 await page.locator("#purchaseBudget").fill("0");
 await page.getByRole("button",{name:/Βρες τι πραγματικά μου ταιριάζει/}).click();
 await expect(page.getByRole("heading",{name:/Από το πρόβλημα/})).toBeVisible();
 await expect(page.locator(".solutionChoice")).toHaveCount(3);
 await expect(page.locator(".merchantOffers")).toHaveCount(0);
});
test("noise pain changes quick setup, alternative selection still works",async({page})=>{
 await page.goto("/");
 await page.getByRole("button",{name:/Λύσε το πρόβλημα: Δεν θέλω να ενοχλώ/}).click();
 await expect(page.locator(".quietControl input")).toBeChecked();
 await page.getByRole("button",{name:/Βρες τι πραγματικά μου ταιριάζει/}).click();
 await expect(page.locator(".solutionChoice")).toHaveCount(3);
 await page.locator(".solutionChoice").nth(1).click();
 await expect(page.locator(".solutionChoice").nth(1)).toHaveAttribute("aria-pressed","true");
});


test("research gallery shows real feed source evidence but no unverified affiliate buying links",async({page},info)=>{
 await page.goto("/research");
 await expect(page.getByRole("heading",{name:/Πραγματικά προϊόντα/})).toBeVisible();
 await expect(page.locator(".sourceCard")).toHaveCount(10);
 await expect(page.locator(".sourceCard a[href^='/api/out']")).toHaveCount(0);
 await expect(page.getByText(/δεν υπάρχει ακόμα κουμπί αγοράς/i)).toBeVisible();
 await page.getByRole("button",{name:"Cardio"}).click();
 await expect(page.locator(".sourceCard").first()).toBeVisible();
 expect(await page.locator(".sourceCard").count()).toBeGreaterThan(0);
 await page.getByRole("button",{name:"Ενδυνάμωση"}).click();
 await expect(page.locator(".sourceCard").first()).toBeVisible();
 await info.attach("real-product-research",{body:await page.screenshot({fullPage:true}),contentType:"image/png"});
});

test("product research preserves premium imagery when retailer CDN is unreachable",async({page})=>{
 await page.route("https://cdn.mybrand.shoes/**",route=>route.abort());
 await page.goto("/research");
 await expect(page.locator(".sourceCard")).toHaveCount(10);
 await expect(page.locator(".sourcePhoto.photoFallback").first()).toBeVisible();
 await expect(page.locator(".sourceVisual").first()).toBeVisible();
 await expect(page.locator(".sourcePhoto.photoReady")).toHaveCount(0);
});


test("image-inspired agent studio renders six interactive pain gaps, six reasoning stages and three top-five lanes",async({page},info)=>{
 await page.goto("/");
 await expect(page.getByRole("heading",{name:/FITMATCH AI.*Pain-Gap/})).toBeVisible();
 await expect(page.locator(".studioPain")).toHaveCount(6);
 await expect(page.locator(".studioEngineStep")).toHaveCount(6);
 await expect(page.locator(".studioLane")).toHaveCount(3);
 await expect(page.locator(".studioProduct")).toHaveCount(15);
 await page.locator("#studio-budget").scrollIntoViewIfNeeded();
 await page.getByRole("button",{name:"0€",exact:true}).click();
 await expect(page.getByText("0€", {exact:true}).first()).toBeVisible();
 await expect(page.locator(".studioProduct.verified")).toHaveCount(0);
 await expect(page.locator(".studioProduct.research")).toHaveCount(0);
 await page.getByRole("button",{name:"500€",exact:true}).click();
 await expect(page.locator(".studioProduct")).toHaveCount(15);
 await info.attach("agentic-studio",{body:await page.screenshot({fullPage:true}),contentType:"image/png"});
});
test("studio visual pain choices change buyer inputs and can be carried into the actual advisor",async({page})=>{
 await page.goto("/");
 await page.locator(".studioPain").filter({hasText:"Θόρυβος"}).click();
 await expect(page.locator(".studioSwitches input[type=checkbox]").first()).toBeChecked();
 await page.getByRole("button",{name:/Δες τη δική μου λύση/}).click();
 await expect(page.locator("#buyer-need")).toContainText("Δεν θέλω να ενοχλώ γείτονες");
 await page.getByRole("button",{name:/Βρες τι πραγματικά μου ταιριάζει/}).click();
 await expect(page.locator(".solutionChoice")).toHaveCount(3);
});
test("studio never exposes purchase buttons for research-only items",async({page})=>{
 await page.goto("/");
 await expect(page.locator(".studioProduct.research a[href^='/api/out']")).toHaveCount(0);
 await expect(page.locator(".studioProduct a[href^='/api/out']")).toHaveCount(0);
 await expect(page.locator(".studioProduct.research")).not.toHaveCount(0);
});


test("contextual AI explains real nearby candidate products instead of returning an empty buying journey",async({page})=>{
 await page.goto("/");
 await page.getByRole("button",{name:/Λύσε το πρόβλημα: Δεν έχω χώρο/}).click();
 await page.locator("#purchaseBudget").fill("450");
 await page.getByRole("button",{name:/Βρες τι πραγματικά μου ταιριάζει/}).click();
 await expect(page.locator(".solutionChoice")).toHaveCount(3);
 await expect(page.locator(".nearbyResults")).toBeVisible();
 await expect(page.locator(".nearbyCard").first()).toBeVisible();
 await expect(page.locator(".nearbyCard a[href^='/api/out']")).toHaveCount(0);
 await expect(page.getByText(/Βρήκαμε .* κοντινές λύσεις από πραγματικά προϊόντα/)).toBeVisible();
});
test("adaptive Top Five shows source-backed cheap strength alternatives without fake purchase links",async({page})=>{
 await page.goto("/");
 await page.getByRole("button",{name:"200€",exact:true}).click();
 await page.getByRole("combobox",{name:"Studio στόχος"}).selectOption("strength");
 await expect(page.locator(".studioLane")).toHaveCount(3);
 await expect(page.locator(".studioProduct")).toHaveCount(15);
 await expect(page.locator(".studioProduct.research").first()).toBeVisible();
 await expect(page.locator(".studioProduct.research .studioNearTag").first()).toBeVisible();
 await expect(page.locator(".studioProduct.research a[href^='/api/out']")).toHaveCount(0);
});
