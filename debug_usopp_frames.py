from PIL import Image, ImageDraw
import os

def debug_sprite_frames(image_path, assumed_frames):
    """Debug ultra précis avec sauvegarde des frames"""
    print(f"\n{'='*80}")
    print(f"DEBUG ULTRA PRECIS: {os.path.basename(image_path)}")
    print(f"{'='*80}")
    
    img = Image.open(image_path)
    total_width, total_height = img.size
    
    print(f"Dimensions de l'image: {total_width}x{total_height}")
    print(f"Tentative avec {assumed_frames} frames...")
    
    # Tester différents nombres de frames
    possible_frames = [assumed_frames - 1, assumed_frames, assumed_frames + 1]
    
    best_match = None
    best_score = 0
    
    for num_frames in possible_frames:
        if num_frames <= 0:
            continue
            
        frame_width = total_width / num_frames
        print(f"\n--- Test avec {num_frames} frames: {frame_width}px par frame ---")
        
        # Vérifier si c'est un nombre entier
        is_integer = frame_width == int(frame_width)
        print(f"  Width par frame: {frame_width:.2f}px {'(ENTIER OK)' if is_integer else '(DECIMAL NON)'}")
        
        if is_integer:
            frame_width = int(frame_width)
            
            # Créer un dossier pour les frames
            output_dir = f"debug_frames_{os.path.basename(image_path).replace('.png', '')}"
            os.makedirs(output_dir, exist_ok=True)
            
            # Extraire et analyser chaque frame
            for i in range(num_frames):
                left = i * frame_width
                right = left + frame_width
                
                frame = img.crop((left, 0, right, total_height))
                
                # Trouver les limites
                pixels = frame.load()
                min_x, max_x = frame_width, 0
                min_y, max_y = total_height, 0
                pixel_count = 0
                
                for y in range(total_height):
                    for x in range(frame_width):
                        r, g, b, a = pixels[x, y]
                        if a > 50:
                            min_x = min(min_x, x)
                            max_x = max(max_x, x)
                            min_y = min(min_y, y)
                            max_y = max(max_y, y)
                            pixel_count += 1
                
                if pixel_count > 0:
                    # Dessiner un rectangle autour du personnage
                    debug_frame = frame.copy()
                    draw = ImageDraw.Draw(debug_frame)
                    draw.rectangle([min_x, min_y, max_x, max_y], outline=(255, 0, 0, 255), width=1)
                    
                    # Sauvegarder
                    debug_frame.save(f"{output_dir}/frame_{i:02d}.png")
                    
                    char_w = max_x - min_x + 1
                    char_h = max_y - min_y + 1
                    
                    print(f"  Frame {i}: perso {char_w}x{char_h}px, X:[{min_x}-{max_x}], Y:[{min_y}-{max_y}], pixels:{pixel_count}")
            
            print(f"\n  [OK] Frames sauvegardees dans: {output_dir}/")
            
            if best_match is None or num_frames == assumed_frames:
                best_match = {
                    'num_frames': num_frames,
                    'frame_width': frame_width,
                    'frame_height': total_height
                }
    
    if best_match:
        print(f"\n{'='*80}")
        print(f"RESULTAT FINAL:")
        print(f"{'='*80}")
        print(f"Nombre de frames: {best_match['num_frames']}")
        print(f"Dimensions par frame: {best_match['frame_width']}x{best_match['frame_height']}")
        print(f"\nCODE PHASER:")
        print(f"this.load.spritesheet('...', '{os.path.basename(image_path)}', {{")
        print(f"    frameWidth: {best_match['frame_width']},")
        print(f"    frameHeight: {best_match['frame_height']}")
        print(f"}});")
        
        return best_match
    
    return None

if __name__ == "__main__":
    print("\n" + "="*80)
    print("DEBUG ULTRA PRECIS DES SPRITES USOPP")
    print("="*80)
    
    # Vérifier l'existence des fichiers
    if not os.path.exists("assets/ussopsprite.png"):
        print("[ERREUR] assets/ussopsprite.png introuvable!")
    else:
        idle_result = debug_sprite_frames("assets/ussopsprite.png", 4)
    
    if not os.path.exists("assets/ussopspritecb.png"):
        print("[ERREUR] assets/ussopspritecb.png introuvable!")
    else:
        combat_result = debug_sprite_frames("assets/ussopspritecb.png", 8)
    
    print("\n" + "="*80)
    print("VERIFIEZ LES FRAMES DANS LES DOSSIERS debug_frames_*")
    print("="*80)

