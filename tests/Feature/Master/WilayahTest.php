<?php

namespace Tests\Feature\Master;

use App\Models\User;
use App\Models\Wilayah;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class WilayahTest extends TestCase
{
    use RefreshDatabase;

    public function test_guests_are_redirected_to_the_login_page(): void
    {
        $response = $this->get('/master/wilayah');

        $response->assertRedirect('/login');
    }

    public function test_authenticated_users_can_view_master_wilayah_index(): void
    {
        $user = User::factory()->create();
        Wilayah::create([
            'nomor_wilayah' => '01',
            'name' => 'Wijk 1 - Test Wilayah',
            'keterangan' => 'Wilayah test unit',
        ]);

        $response = $this->actingAs($user)->get('/master/wilayah');

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('master/wilayah/index')
            ->has('wilayahs.data', 1)
            ->where('wilayahs.data.0.nomor_wilayah', '01')
            ->where('wilayahs.data.0.name', 'Wijk 1 - Test Wilayah')
        );
    }

    public function test_authenticated_users_can_view_master_wilayah_index_alias(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->get('/master/wilayah/index');

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('master/wilayah/index')
        );
    }

    public function test_create_method_redirects_to_index(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->get('/master/wilayah/create');

        $response->assertRedirect(route('master.wilayah.index'));
    }

    public function test_user_can_create_a_wilayah(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->post('/master/wilayah', [
            'nomor_wilayah' => '1A',
            'name' => 'Wijk 1A (Pemekaran)',
            'keterangan' => 'Pemekaran Wijk 1',
        ]);

        $response->assertRedirect(route('master.wilayah.index'));
        $this->assertDatabaseHas('wilayahs', [
            'nomor_wilayah' => '1A',
            'name' => 'Wijk 1A (Pemekaran)',
            'keterangan' => 'Pemekaran Wijk 1',
        ]);
    }

    public function test_user_can_view_wilayah_details_as_json(): void
    {
        $user = User::factory()->create();
        $wilayah = Wilayah::create([
            'nomor_wilayah' => '02',
            'name' => 'Wijk Detail',
            'keterangan' => 'Keterangan detail',
        ]);

        $response = $this->actingAs($user)->getJson("/master/wilayah/{$wilayah->id}");

        $response->assertOk();
        $response->assertJsonFragment([
            'nomor_wilayah' => '02',
            'name' => 'Wijk Detail',
        ]);
    }

    public function test_user_can_view_wilayah_edit_as_json(): void
    {
        $user = User::factory()->create();
        $wilayah = Wilayah::create([
            'nomor_wilayah' => '03',
            'name' => 'Wijk Edit',
            'keterangan' => 'Keterangan edit',
        ]);

        $response = $this->actingAs($user)->getJson("/master/wilayah/{$wilayah->id}/edit");

        $response->assertOk();
        $response->assertJsonFragment([
            'nomor_wilayah' => '03',
            'name' => 'Wijk Edit',
        ]);
    }

    public function test_user_can_update_a_wilayah(): void
    {
        $user = User::factory()->create();
        $wilayah = Wilayah::create([
            'nomor_wilayah' => '04',
            'name' => 'Wijk Lama',
            'keterangan' => 'Keterangan lama',
        ]);

        $response = $this->actingAs($user)->put("/master/wilayah/{$wilayah->id}", [
            'nomor_wilayah' => '04B',
            'name' => 'Wijk Update',
            'keterangan' => 'Keterangan update',
        ]);

        $response->assertRedirect(route('master.wilayah.index'));
        $this->assertDatabaseHas('wilayahs', [
            'id' => $wilayah->id,
            'nomor_wilayah' => '04B',
            'name' => 'Wijk Update',
        ]);
    }

    public function test_user_can_delete_a_wilayah(): void
    {
        $user = User::factory()->create();
        $wilayah = Wilayah::create([
            'nomor_wilayah' => '05',
            'name' => 'Wijk Dihapus',
            'keterangan' => 'Akan dihapus',
        ]);

        $response = $this->actingAs($user)->delete("/master/wilayah/{$wilayah->id}");

        $response->assertRedirect(route('master.wilayah.index'));
        $this->assertDatabaseMissing('wilayahs', [
            'id' => $wilayah->id,
        ]);
    }
}
