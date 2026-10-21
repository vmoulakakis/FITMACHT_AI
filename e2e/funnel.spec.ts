import {test,expect} from "@playwright/test";
test("Greek landing to verified walking advice and zero-fabrication fallback",async({page},info)=>{
 await page.goto("/");
 await expect(page).toHaveTitle(/FITMATCH AI/);
 await expect(page.getByRole("heading",{name:/Ο σωστός εξοπλισμός/})).toBeVisible();
 await info.attach("landing",{body:await page.screenshot({fullPage:true}),contentType:"image/png"});
 await page.getByRole("button",{name:/Βρες τι σου ταιριάζει/}).click();
 await expect(page.getByRole("heading",{name:/Ποιος είναι ο στόχος σου/})).toBeVisible();
 for(let i=0;i<5;i++)await page.getByRole("button",{name:"Συνέχεια"}).click();
 await page.getByRole("button",{name:"Δες την πρότασή μου"}).click();
 await expect(page.getByRole("heading",{name:"Walking pad"})).toBeVisible();
 await expect(page.getByText(/Δεν εμφανίζουμε μη επαληθευμένες προσφορές/)).toBeVisible();
 await info.attach("walking-result",{body:await page.screenshot({fullPage:true}),contentType:"image/png"});
});
test("strength user skips irrelevant activity and noise screens",async({page},info)=>{
 await page.goto("/");
 await page.getByRole("button",{name:/Βρες τι σου ταιριάζει/}).click();
 await page.getByRole("button",{name:/Δύναμη & ενδυνάμωση/}).click();
 await expect(page.getByText("Βήμα 1 από 4")).toBeVisible();
 await page.getByRole("button",{name:"Συνέχεια"}).click();
 await expect(page.getByRole("heading",{name:/Πόσο χώρο διαθέτεις/})).toBeVisible();
 await page.getByRole("button",{name:"Συνέχεια"}).click();
 await expect(page.getByRole("heading",{name:/Ποιο είναι το ανώτατο budget/})).toBeVisible();
 await page.getByRole("button",{name:"Συνέχεια"}).click();
 await expect(page.getByRole("heading",{name:/Θέλεις να αποθηκεύεται εύκολα/})).toBeVisible();
 await page.getByRole("button",{name:"Δες την πρότασή μου"}).click();
 await expect(page.getByRole("heading",{name:"Ρυθμιζόμενοι αλτήρες"})).toBeVisible();
 await info.attach("strength-result",{body:await page.screenshot({fullPage:true}),contentType:"image/png"});
});
