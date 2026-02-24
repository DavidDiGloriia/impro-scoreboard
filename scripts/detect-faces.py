#!/usr/bin/env python3
"""Detect face positions in player photos using Google MediaPipe with perturbations."""
import mediapipe as mp
import cv2
import numpy as np
import json
import glob
import os

ASSETS_DIR = os.path.join(os.path.dirname(__file__), '..', 'src', 'assets', 'joueurs')
OUTPUT = os.path.join(os.path.dirname(__file__), '..', 'src', 'assets', 'data', 'face-positions.json')
MODEL_PATH = '/tmp/blaze_face_short_range.tflite'
NUM_PASSES = 100

BaseOptions = mp.tasks.BaseOptions
FaceDetector = mp.tasks.vision.FaceDetector
FaceDetectorOptions = mp.tasks.vision.FaceDetectorOptions

options = FaceDetectorOptions(
    base_options=BaseOptions(model_asset_path=MODEL_PATH),
    min_detection_confidence=0.2,
)

np.random.seed(42)

# Pre-generate perturbation params
perturbations = []
for i in range(NUM_PASSES):
    perturbations.append({
        'brightness': np.random.uniform(-30, 30),
        'contrast': np.random.uniform(0.8, 1.2),
        'angle': np.random.uniform(-3, 3),
    })
# First pass is always the original image
perturbations[0] = {'brightness': 0, 'contrast': 1.0, 'angle': 0}


def apply_perturbation(img, p):
    result = img.astype(np.float32)
    result = result * p['contrast'] + p['brightness']
    result = np.clip(result, 0, 255).astype(np.uint8)

    if abs(p['angle']) > 0.01:
        h, w = result.shape[:2]
        M = cv2.getRotationMatrix2D((w / 2, h / 2), p['angle'], 1.0)
        result = cv2.warpAffine(result, M, (w, h), borderMode=cv2.BORDER_REFLECT)

    return result


positions = {}
jpgs = sorted(glob.glob(os.path.join(ASSETS_DIR, '*.jpg')))
print(f"Processing {len(jpgs)} images x {NUM_PASSES} passes with MediaPipe...")

with FaceDetector.create_from_options(options) as detector:
    for path in jpgs:
        filename = os.path.basename(path)
        key = 'assets/joueurs/' + filename
        img = cv2.imread(path)
        if img is None:
            print(f"  SKIP (can't read): {filename}")
            continue

        all_cx, all_cy = [], []

        for p in perturbations:
            perturbed = apply_perturbation(img, p)
            rgb = cv2.cvtColor(perturbed, cv2.COLOR_BGR2RGB)
            mp_image = mp.Image(image_format=mp.ImageFormat.SRGB, data=rgb)
            results = detector.detect(mp_image)

            if results.detections:
                best = max(results.detections, key=lambda d: d.categories[0].score)
                bb = best.bounding_box
                h, w = img.shape[:2]
                cx = (bb.origin_x + bb.width / 2) / w * 100
                cy = (bb.origin_y + bb.height / 2) / h * 100
                all_cx.append(cx)
                all_cy.append(cy)

        if all_cx:
            avg_x = round(sum(all_cx) / len(all_cx))
            avg_y = round(sum(all_cy) / len(all_cy))
            positions[key] = {"x": avg_x, "y": avg_y}
            print(f"  OK {filename} -> {avg_x}% {avg_y}% ({len(all_cx)}/{NUM_PASSES} detections)")
        else:
            positions[key] = {"x": 50, "y": 15}
            print(f"  NO FACE {filename} -> fallback 50% 15%")

with open(OUTPUT, 'w') as f:
    json.dump(positions, f, indent=2)

print(f"\nDone! {len(positions)} entries written to {OUTPUT}")
found = sum(1 for v in positions.values() if v != {"x": 50, "y": 15})
print(f"Faces detected: {found}/{len(positions)}")
