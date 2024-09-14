//This script is a part of VakantieVeiliger.

async function main() {
    await new Promise((resolve) => setTimeout(resolve, 2000)); //hacky way to make sure everything is loaded

    let totalCost = 0;
    let bidAmount = 0;

    async function onInput(e) {
        const parentParent = e.target.parentElement.parentElement;
        let actualCostElement = document.getElementById("actualCost");
        const userBid = parseFloat(e.target.value);
        let actualCost = userBid + totalCost - bidAmount;
        if (isNaN(actualCost)) actualCost = 0;
        const newValue = `€ ${actualCost.toFixed(2)}`;
        if (!actualCostElement) {
            actualCostElement = document.createElement("p");
            actualCostElement.id = "actualCost";
            actualCostElement.textContent = newValue;
            parentParent.appendChild(actualCostElement);
        } else {
            actualCostElement.textContent = newValue;
        }
    }

    setInterval(async () => {
        for (let i = 0; i < document.getElementsByName("bid").length; i++) {
            const elem = document.getElementsByName("bid")[i];
            if (elem.dataset.listenerAttached) continue;
            elem.dataset.listenerAttached = true;
            elem.addEventListener("input", onInput);
        }

        const highestBidElements = document.querySelectorAll(
            '[data-aq="placed-bid-highest"]'
        );

        const firstHighestBid = highestBidElements[0];
        //find h4 with content "Verplichte kosten"
        let verplichteKostenElement;
        let plusMinElement;
        //loop through all h4 elements
        for (let i = 0; i < document.querySelectorAll("h4").length; i++) {
            if (
                document.querySelectorAll("h4")[i].textContent === "Verplichte kosten"
            ) {
                verplichteKostenElement = document.querySelectorAll("h4")[i];
            }
        }
        //loop through all h5
        for (let i = 0; i < document.querySelectorAll("h5").length; i++) {
            if (
                document.querySelectorAll("h5")[i].textContent === "Plus- en minpunten"
            ) {
                plusMinElement = document.querySelectorAll("h5")[i];
            }
        }
        //get parent of that h4
        const verplichteKostenParent = verplichteKostenElement?.parentElement;

        if (!verplichteKostenParent?.dataset.hasMoved) {
            verplichteKostenParent.dataset.hasMoved = true;
            verplichteKostenParent.style.position = "absolute";
            verplichteKostenParent.style.top = "200px";
            verplichteKostenParent.style.backgroundColor = "white";
            verplichteKostenParent.style.zIndex = "1000";
            verplichteKostenParent.style.border = "1px solid black";
            verplichteKostenParent.style.padding = "10px";
            verplichteKostenParent.style.borderRadius = "10px";
            verplichteKostenParent.style.boxShadow = "0 0 10px 0 rgba(0, 0, 0, 0.5)";
            verplichteKostenParent.style.width = "300px";
            verplichteKostenParent.style.left = "50px";
            verplichteKostenParent.style.pointerEvents = "none";
            verplichteKostenParent.id = "firstInViewElement";
        }

        plusMinElement = plusMinElement?.parentElement;

        if (plusMinElement && !plusMinElement.dataset.moved) {
            plusMinElement.dataset.moved = true;
            //add to verplichteKostenParent
            verplichteKostenParent.appendChild(plusMinElement);
        }

        //make place button more boring
        const placeButton = document.querySelector('[data-aq="place-bid"]');
        if (placeButton && !placeButton.dataset.borified) {
            placeButton.dataset.borified = true;
            placeButton.style.backgroundColor = "#007bff";
            placeButton.style.color = "white";
            placeButton.style.border = "none";
            placeButton.style.padding = "10px 20px";
            placeButton.style.borderRadius = "5px";
            placeButton.style.cursor = "pointer";
        }

        //get all children of that parent
        const verplichteKostenChildren = verplichteKostenParent.children;

        //get the second child
        const verplichteKostenSecondChild = verplichteKostenChildren[1];

        const costs = [];

        //loop through all children of that parent
        for (let i = 0; i < verplichteKostenSecondChild.children.length; i++) {
            const child = verplichteKostenSecondChild.children[i];
            const text = child.textContent;
            const type = text.split("€ ")[0].trim().replaceAll(",", ".");
            const cost = text.split("€ ")[1].trim().replaceAll(",", ".");
            costs.push({ type, cost: parseFloat(cost) });
        }

        console.log(costs);

        const highestBidText = firstHighestBid?.textContent || "€ 0";

        let highestBid;
        //filter out all characters from highestbidtext that are not numbers,eurotekens or periods. Also
        for (let i = 0; i < highestBidText.length; i++) {
            if (
                !isNaN(highestBidText[i]) ||
                highestBidText[i] === "€" ||
                highestBidText[i] === "."
            ) {
                highestBid += highestBidText[i];
            }
        }
        highestBid = highestBid.replace("€", "").trim();
        highestBid = highestBid.split(" ")[1];
        const highestBidFloat = parseFloat(highestBid);

        bidAmount = highestBidFloat;
        totalCost = highestBidFloat;

        for (let i = 0; i < costs.length; i++) {
            totalCost += costs[i].cost;
        }

        //find the h3 element in highestBid
        const highestBidParent = document.querySelector('[data-aq="highest-bid"]');
        const h3Elements = highestBidParent.querySelectorAll("h3");
        let h3Element = h3Elements[0];

        //edit the text of the h3 element
        h3Element.textContent = `€ ${highestBidFloat} (€ ${totalCost})`;
    }, 1000);
}

main();
