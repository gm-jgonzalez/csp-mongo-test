const fallBacksDirective = {
	"script-src-elem": "script-src",
	"script-src-attr": "script-src",
	"style-src-elem": "style-src",
	"style-src-attr": "style-src",
	"frame-src": "child-src",
	"worker-src": "child-src",
};

const blockedResourceXss = ["eval", "inline"];

const xssDataDirectives = ["script-src", "style-src", "img-src", "object-src"];

const detectAttack = (blockedResource, violatedDirective) => {
	const fallbackDirective = fallBacksDirective[violatedDirective] || "";

	// we need to analyze the violated-directive and the blocked-uri for most of the attack cases.

	// XSS cases

    console.log({
        blockedResource,
        violatedDirective,
        fallbackDirective,
        blockedResourceXss,
        includes : blockedResourceXss.includes(blockedResource),
        notIncludes : !blockedResourceXss.includes(blockedResource)
    })

	const isXssExternalInjection = (fallbackDirective === "script-src" || violatedDirective === "script-src") && !blockedResourceXss.includes(blockedResource);

	const isXssInlineInjection = (fallbackDirective === "script-src" || violatedDirective === "script-src") && blockedResource === "inline";

	const isDataXss = (xssDataDirectives.includes(fallbackDirective) || xssDataDirectives.includes(violatedDirective)) && blockedResource === "data";

	// eval()

	const notPermittedEval = (fallbackDirective === "script-src" || violatedDirective === "script-src") && blockedResource === "eval";

	// malisous iframe

	const isIframeInjection = (fallbackDirective === "child-src" || violatedDirective === "child-src") && !blockedResourceXss.includes(blockedResource);

	// clickjacking
	const isClickJacking = fallbackDirective === "frame-ancestors";

	// style injection

	const isStyleInjection = fallBacksDirective[violatedDirective] === "style-src" && !blockedResourceXss.includes(blockedResource);

    const isStyleInlineInjection = fallBacksDirective[violatedDirective] === "style-src" && blockedResource === "inline";

	// malicious worker

    const isWorkerInjection = (fallbackDirective === "child-src" || violatedDirective === "worker-src") && !blockedResourceXss.includes(blockedResource);

	// data exfiltration 

	const isDataExfiltration = (fallbackDirective === "connect-src" || violatedDirective === "connect-src");

    console.log({
        isXssExternalInjection,
        isXssInlineInjection,
        isDataXss,
        notPermittedEval,
        isIframeInjection,
        isClickJacking,
        isStyleInjection,
        isWorkerInjection,
    })

	if (isXssExternalInjection) {
		return {
			attackType: "XSS Script Injection",
			attackDescription: "Possible XSS attack via script injection",
		};
	}

	if (isXssInlineInjection) {
		return {
			attackType: "XSS Script Inline Injection",
			attackDescription: "Possible XSS attack via inline injection",
		};
	}

	if (notPermittedEval) {
		return {
			attackType: "Not permitted use of Eval()",
			attackDescription: "Possible execution of eval() not permitted",
		};
	}

	if (isIframeInjection) {
		return {
			attackType: "Iframe Injection",
			attackDescription: "Possible iframe injection",
		};
	}

	if (isClickJacking) {
		return {
			attackType: "Clickjacking",
			attackDescription: "Possible clickjacking attack",
		};
	}

	if (isDataXss) {
		return {
			attackType: "XSS Data Injection",
			attackDescription: "Possible XSS attack via data injection",
		};
	}

	if (isStyleInjection) {
		return {
			attackType: "Style Injection",
			attackDescription: "Possible style via URL injection",
		};
	}

    if (isStyleInlineInjection) {
		return {
			attackType: "Inline Style Injection",
			attackDescription: "Possible inline style injection",
		};
	}

    if (isWorkerInjection) {
        return {
            attackType: "Malicious Worker",
            attackDescription: "Possible malicious worker injection",
        }
    }

	if (isDataExfiltration) {
		return {
			attackType: "Data Exfiltration",
			attackDescription: "Possible data exfiltration",
		};
	}
};

module.exports = {
	detectAttack,
};
