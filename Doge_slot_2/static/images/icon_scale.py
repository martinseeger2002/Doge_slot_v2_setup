from PIL import Image

# Loop through image files from 1 to 9
for i in range(4, 4):
    # Construct the input and output file paths
    input_file = f"reel_icon_{i}_big.png"
    output_file = f"reel_icon_{i}_150x150.png"

    # Open the input image (1024x1024)
    input_image = Image.open(input_file)

    # Resize the image to 150x150 pixels using antialiasing (BILINEAR) for better quality
    output_image = input_image.resize((150, 150), Image.BILINEAR)

    # Save the resized image
    output_image.save(output_file)

    # Close the images to release resources (optional but recommended)
    input_image.close()
    output_image.close()
