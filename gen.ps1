$folder_path = Read-Host "Enter the folder path (e.g. core/users)"
$name = Read-Host "Enter the module name (e.g. user)"

New-Item -ItemType Directory -Force -Path "src/$folder_path"

nest g module $folder_path/$name --flat
nest g controller $folder_path/$name --flat
nest g service $folder_path/$name --flat