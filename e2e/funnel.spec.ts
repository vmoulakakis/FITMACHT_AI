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
