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

const detectAttackClaude = (blockedResource, violatedDirective, scriptSample = '', sourceFile = '') => {
    const fallbackDirective = fallBacksDirective[violatedDirective] || "";
    
    // Agregar logging para depuración
    console.log({
        blockedResource,
        violatedDirective,
        fallbackDirective,
        scriptSample,
        sourceFile
    });

    // Detección específica para eval()
    const isEval = blockedResource === "inline" && 
                  (violatedDirective === "script-src-elem" || 
                   violatedDirective === "script-src") && 
                   scriptSample && scriptSample.includes("eval");
    
    // Detección para data exfiltration/data-url
    const isDataUrl = blockedResource === "inline" && 
                     (violatedDirective === "script-src-elem" || 
                      violatedDirective === "script-src") && 
                      (scriptSample && scriptSample.includes("data:") || 
                       sourceFile && sourceFile.startsWith("data:"));
    
    // Detección para worker
    const isWorker = blockedResource === "inline" && 
                    (violatedDirective === "script-src-elem" || 
                     violatedDirective === "worker-src" || 
                     violatedDirective === "child-src") && 
                     scriptSample && 
                     (scriptSample.includes("new Worker") || 
                      scriptSample.includes("importScripts"));

    // XSS casos
    const isXssExternalInjection = (fallbackDirective === "script-src" || 
                                    violatedDirective === "script-src" || 
                                    violatedDirective === "script-src-elem") && 
                                    !blockedResourceXss.includes(blockedResource) && 
                                    blockedResource !== "data:";

    const isXssInlineInjection = (fallbackDirective === "script-src" || 
                                 violatedDirective === "script-src" || 
                                 violatedDirective === "script-src-elem") && 
                                 blockedResource === "inline" && 
                                 !isEval && !isDataUrl && !isWorker;

    const isDataXss = ((xssDataDirectives.includes(fallbackDirective) || 
                      xssDataDirectives.includes(violatedDirective)) && 
                      blockedResource === "data:") || isDataUrl;

    // iframe malicioso
    const isIframeInjection = (fallbackDirective === "child-src" || 
                              violatedDirective === "child-src" || 
                              violatedDirective === "frame-src") && 
                              !blockedResourceXss.includes(blockedResource);

    // clickjacking
    const isClickJacking = fallbackDirective === "frame-ancestors" || 
                          violatedDirective === "frame-ancestors";

    // style injection
    const isStyleInjection = (fallBacksDirective[violatedDirective] === "style-src" || 
                             violatedDirective === "style-src" || 
                             violatedDirective === "style-src-elem") && 
                             !blockedResourceXss.includes(blockedResource);

    const isStyleInlineInjection = (fallBacksDirective[violatedDirective] === "style-src" || 
                                   violatedDirective === "style-src" || 
                                   violatedDirective === "style-src-elem") && 
                                   blockedResource === "inline";

    // malicious worker
    const isWorkerInjection = isWorker || 
                             ((fallbackDirective === "child-src" || 
                               violatedDirective === "worker-src") && 
                              !blockedResourceXss.includes(blockedResource));

    console.log({
        isXssExternalInjection,
        isXssInlineInjection,
        isDataXss,
		isDataUrl,
        isEval,
        isIframeInjection,
        isClickJacking,
        isStyleInjection,
        isStyleInlineInjection,
        isWorkerInjection,
		isWorker,
    });

    // Prioridad de detección
    if (isEval) {
        return {
            attackType: "Not permitted use of Eval()",
            attackDescription: "Possible execution of eval() not permitted",
        };
    }

    if (isDataXss || isDataUrl) {
        return {
            attackType: "XSS Data Injection",
            attackDescription: "Possible XSS attack via data: URI injection",
        };
    }

    if (isWorkerInjection || isWorker) {
        return {
            attackType: "Malicious Worker",
            attackDescription: "Possible malicious worker injection",
        };
    }

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

    // Si no se detecta ningún ataque específico
    return {
        attackType: "Unknown Violation",
        attackDescription: `CSP violation of ${violatedDirective} blocking ${blockedResource}`,
    };
};

module.exports = {
    detectAttackClaude,
};