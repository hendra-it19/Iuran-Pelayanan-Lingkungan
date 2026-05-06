<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class CompanyController extends Controller
{
    public function edit()
    {
        $setting = Setting::first() ?? new Setting;

        return Inertia::render('settings/company', [
            'setting' => $setting,
            'logoUrl' => $setting->company_logo ? Storage::disk('file_upload')->url($setting->company_logo) : null,
        ]);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'company_name' => 'required|string|max:255',
            'company_address_pusat' => 'nullable|string',
            'company_address_lokasi' => 'nullable|string',
            'company_phone' => 'nullable|string|max:255',
            'company_city' => 'nullable|string|max:255',
            'company_leader' => 'nullable|string|max:255',
            'company_logo' => 'nullable|image|mimes:png,jpg,jpeg,svg,webp|max:2048',
            'theme_color' => 'nullable|string|max:255',
        ]);

        $setting = Setting::first() ?? new Setting;

        // Handle logo upload
        if ($request->hasFile('company_logo')) {
            // Delete old logo if exists
            if ($setting->company_logo && Storage::disk('file_upload')->exists($setting->company_logo)) {
                Storage::disk('file_upload')->delete($setting->company_logo);
            }

            $path = $request->file('company_logo')->store('logos', 'file_upload');
            $setting->company_logo = $path;
        }

        $setting->fill(collect($validated)->except('company_logo')->toArray());
        $setting->save();

        return back()->with('success', 'Pengaturan Perusahaan berhasil diperbarui.');
    }

    public function deleteLogo()
    {
        $setting = Setting::first();

        if ($setting && $setting->company_logo) {
            Storage::disk('file_upload')->delete($setting->company_logo);
            $setting->company_logo = null;
            $setting->save();
        }

        return back()->with('success', 'Logo berhasil dihapus.');
    }
}
