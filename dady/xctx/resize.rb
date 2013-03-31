ARGV.each do |file|
  ss=file.gsub(/.PNG|.JPG/i, '')
  puts "convert -resize 240x180 #{file} #{ss}-thumb.jpg"
end  