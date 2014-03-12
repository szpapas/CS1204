class Ydb < ActiveRecord::Base
  attr_accessible :id, :cx, :gdfs, :crfapzrq, :ggrq
  def self.to_csv
    CSV.generate do |csv|
      csv << column_names
      all.each do |ydb|
        csv << ydb.attributes.values_at(*column_names)
      end
    end
  end
end