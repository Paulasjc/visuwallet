import { test, expect } from '@playwright/test';

test.describe('VisuWallet UI', () => {
  test('muestra la pantalla de bienvenida con marca y CTA', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('heading', { name: /visuwallet/i })).toBeVisible();
    await expect(page.getByText('VISUALIZA TUS FINANZAS')).toBeVisible();
    await expect(page.getByRole('button', { name: /subir archivo csv/i })).toBeVisible();
  });

  test('el botón de subir CSV está enfocable por teclado', async ({ page }) => {
    await page.goto('/');

    const uploadButton = page.getByRole('button', { name: /subir archivo csv/i });
    await uploadButton.focus();
    await expect(uploadButton).toBeFocused();
  });
});
