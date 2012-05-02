$:<<'/Library/Ruby/Gems/1.8/gems/gd2-1.1.1/lib'
require 'gd2'
include GD2

ARGV.each do |file|
  puts "Processing #{file}..."
  image = Image.import(file) 
  image.resize! 16, 16
  image.export(file.gsub('.jpg','16.png'))
end

puts "Done!"