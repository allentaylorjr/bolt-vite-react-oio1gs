export function generateEmbedCode(baseUrl: string, churchId: string, sermonId?: string): string {
  const iframeSrc = sermonId 
    ? `${baseUrl}/embed/${churchId}/sermon/${sermonId}`
    : `${baseUrl}/embed/${churchId}/collection`;

  return `<script src="https://cdnjs.cloudflare.com/ajax/libs/iframe-resizer/4.3.9/iframeResizer.min.js"></script>
<iframe 
  src="${iframeSrc}" 
  style="width: 100%; min-height: 0; border: none;"
  scrolling="no"
  title="${sermonId ? 'Sermon Player' : 'Sermon Collection'}"
></iframe>
<script>
  iFrameResize({ 
    log: false,
    checkOrigin: false,
    heightCalculationMethod: 'documentElementOffset'
  });
</script>`;
}