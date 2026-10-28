/** Animate only a standalone numeric literal. Scores, dates and mixed text stay literal. */
export const formatCounter = (raw, progress) => {
 const text=String(raw).trim();if(!/^[+-]?\d[\d,]*(?:\.\d+)?$/.test(text))return String(raw);
 const clean=text.replaceAll(',','');const value=Number(clean);if(!Number.isFinite(value))return String(raw);
 const decimals=clean.includes('.')?clean.split('.')[1].length:0;
 const result=new Intl.NumberFormat('en-US',{minimumFractionDigits:Math.min(decimals,6),maximumFractionDigits:Math.min(decimals,6)}).format(value*Math.max(0,Math.min(1,progress)));
 return text.startsWith('+')&&!result.startsWith('-')?'+'+result:result;
};
