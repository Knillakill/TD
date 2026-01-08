from PIL import Image
import os

def find_divisors(n):
    """Trouve tous les diviseurs d'un nombre"""
    divisors = []
    for i in range(1, int(n**0.5) + 1):
        if n % i == 0:
            divisors.append(i)
            if i != n // i:
                divisors.append(n // i)
    return sorted(divisors)

def test_all_frame_counts(image_path):
    """Teste tous les découpages possibles"""
    print(f"\n{'='*80}")
    print(f"RECHERCHE DU BON NOMBRE DE FRAMES: {os.path.basename(image_path)}")
    print(f"{'='*80}")
    
    img = Image.open(image_path)
    total_width, total_height = img.size
    
    print(f"Dimensions: {total_width}x{total_height}")
    
    # Trouver tous les diviseurs
    divisors = find_divisors(total_width)
    print(f"\nDiviseurs de {total_width}: {divisors}")
    print(f"Nombres de frames possibles: {divisors}\n")
    
    # Tester chaque diviseur
    results = []
    
    for num_frames in divisors:
        frame_width = total_width // num_frames
        
        print(f"--- {num_frames} frames ({frame_width}x{total_height} par frame) ---")
        
        # Créer dossier debug
        output_dir = f"debug_{os.path.basename(image_path).replace('.png', '')}_{num_frames}f"
        os.makedirs(output_dir, exist_ok=True)
        
        frame_data = []
        
        for i in range(num_frames):
            left = i * frame_width
            right = left + frame_width
            
            frame = img.crop((left, 0, right, total_height))
            
            # Analyser
            pixels = frame.load()
            pixel_count = 0
            min_x, max_x = frame_width, 0
            min_y, max_y = total_height, 0
            
            for y in range(total_height):
                for x in range(frame_width):
                    r, g, b, a = pixels[x, y]
                    if a > 50:
                        pixel_count += 1
                        min_x = min(min_x, x)
                        max_x = max(max_x, x)
                        min_y = min(min_y, y)
                        max_y = max(max_y, y)
            
            # Sauvegarder
            frame.save(f"{output_dir}/frame_{i:02d}.png")
            
            if pixel_count > 0:
                char_w = max_x - min_x + 1
                char_h = max_y - min_y + 1
                frame_data.append({
                    'index': i,
                    'pixels': pixel_count,
                    'char_size': f"{char_w}x{char_h}",
                    'bounds': f"X:[{min_x}-{max_x}] Y:[{min_y}-{max_y}]"
                })
                print(f"  Frame {i}: {char_w:2d}x{char_h:2d}px, {pixel_count:4d} pixels, X:[{min_x:2d}-{max_x:2d}] Y:[{min_y:2d}-{max_y:2d}]")
            else:
                print(f"  Frame {i}: VIDE (0 pixels)")
        
        # Évaluer la qualité du découpage
        if frame_data:
            avg_pixels = sum(f['pixels'] for f in frame_data) / len(frame_data)
            min_pixels = min(f['pixels'] for f in frame_data)
            
            # Un bon découpage a des frames avec un nombre similaire de pixels
            variance = sum((f['pixels'] - avg_pixels) ** 2 for f in frame_data) / len(frame_data)
            quality_score = 1000 / (1 + variance / avg_pixels)
            
            results.append({
                'num_frames': num_frames,
                'frame_width': frame_width,
                'frame_height': total_height,
                'avg_pixels': avg_pixels,
                'min_pixels': min_pixels,
                'quality_score': quality_score,
                'output_dir': output_dir
            })
            
            print(f"  Qualite: {quality_score:.2f} (moy={avg_pixels:.0f} pixels, min={min_pixels})")
        
        print(f"  Sauvegarde: {output_dir}/\n")
    
    # Trouver le meilleur
    if results:
        # Filtrer les résultats aberrants (trop peu ou trop de frames)
        reasonable_results = [r for r in results if 2 <= r['num_frames'] <= 20]
        
        if reasonable_results:
            best = max(reasonable_results, key=lambda r: r['quality_score'])
            
            print(f"\n{'='*80}")
            print(f"MEILLEUR DECOUPAGE DETECTE:")
            print(f"{'='*80}")
            print(f"Nombre de frames: {best['num_frames']}")
            print(f"Dimensions par frame: {best['frame_width']}x{best['frame_height']}")
            print(f"Score de qualite: {best['quality_score']:.2f}")
            print(f"Dossier: {best['output_dir']}/")
            print(f"\nCODE PHASER:")
            print(f"this.load.spritesheet('...', '{os.path.basename(image_path)}', {{")
            print(f"    frameWidth: {best['frame_width']},")
            print(f"    frameHeight: {best['frame_height']}")
            print(f"}});")
            print(f"// Nombre de frames dans l'animation: {best['num_frames']}")
            
            return best

if __name__ == "__main__":
    print("\n" + "="*80)
    print("RECHERCHE AUTOMATIQUE DU BON NOMBRE DE FRAMES")
    print("="*80)
    
    if os.path.exists("assets/ussopsprite.png"):
        idle = test_all_frame_counts("assets/ussopsprite.png")
    
    if os.path.exists("assets/ussopspritecb.png"):
        combat = test_all_frame_counts("assets/ussopspritecb.png")
    
    print("\n" + "="*80)
    print("VERIFIEZ LES DOSSIERS debug_* POUR VOIR LES FRAMES")
    print("="*80)

