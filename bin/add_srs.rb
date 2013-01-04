ARGV.each do |f|
  puts "processing #{f}"
  system("gdal_translate -a_srs EPSG:2364  #{f}  #{f}f"
end